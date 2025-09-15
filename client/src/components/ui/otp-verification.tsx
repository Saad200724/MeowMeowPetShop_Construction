import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, RefreshCw } from 'lucide-react'
import { sendOtp, verifyOtp } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface OtpVerificationProps {
  email: string
  isSignUp: boolean
  onSuccess: (user: any) => void
  onBack: () => void
}

export function OtpVerification({ email, isSignUp, onSuccess, onBack }: OtpVerificationProps) {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const { toast } = useToast()

  // Start cooldown timer
  const startCooldown = () => {
    setResendCooldown(60) // 60 seconds cooldown
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const { data, error: verifyError } = await verifyOtp(email, otp)

      if (verifyError) {
        setError(verifyError.message)
        setOtp('') // Clear the OTP field on error
      } else if (data?.session) {
        toast({
          title: 'Success!',
          description: isSignUp ? 'Account created successfully!' : 'Signed in successfully!'
        })
        onSuccess(data.user)
      } else {
        setError('Verification failed. Please try again.')
        setOtp('')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setOtp('')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    setError('')

    try {
      const { error: resendError } = await sendOtp(email, isSignUp)

      if (resendError) {
        setError(resendError.message)
      } else {
        toast({
          title: 'Code sent!',
          description: 'A new verification code has been sent to your email.'
        })
        startCooldown()
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? 'Verify Your Email' : 'Enter Verification Code'}
        </CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to{' '}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Verification Code</label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                disabled={isVerifying}
                data-testid="input-otp"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full"
            data-testid="button-verify-otp"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{' '}
          <Button
            variant="link"
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending}
            className="h-auto p-0 text-sm"
            data-testid="button-resend-otp"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                Resending...
              </>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              'Resend code'
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={onBack}
          className="w-full"
          data-testid="button-back"
        >
          Back to {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </CardContent>
    </Card>
  )
}