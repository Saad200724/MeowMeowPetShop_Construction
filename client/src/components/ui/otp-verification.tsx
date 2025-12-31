import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, RefreshCw } from 'lucide-react'
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
    setResendCooldown(60)
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
      // Firebase-based verification would go here
      // For now, simulate success
      toast({
        title: 'Success!',
        description: isSignUp ? 'Account created successfully!' : 'Signed in successfully!',
      })
      onSuccess({ email })
    } catch (err) {
      setError('Verification failed. Please try again.')
      setOtp('')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    startCooldown()

    try {
      // Firebase OTP resend would go here
      toast({
        title: 'Code Resent',
        description: 'A new verification code has been sent to your email.',
      })
    } catch (err) {
      toast({
        title: 'Failed to Resend',
        description: 'Could not resend code. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl text-[#26732d]">Verify Your Email</CardTitle>
        <CardDescription>Enter the 6-digit code sent to {email}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isVerifying}>
            <InputOTPGroup>
              <InputOTPSlot index={0} data-testid="otp-slot-0" />
              <InputOTPSlot index={1} data-testid="otp-slot-1" />
              <InputOTPSlot index={2} data-testid="otp-slot-2" />
              <InputOTPSlot index={3} data-testid="otp-slot-3" />
              <InputOTPSlot index={4} data-testid="otp-slot-4" />
              <InputOTPSlot index={5} data-testid="otp-slot-5" />
            </InputOTPGroup>
          </InputOTP>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={handleVerifyOtp}
          disabled={isVerifying || otp.length !== 6}
          className="w-full"
          variant="meowGreen"
          data-testid="button-verify"
        >
          {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isVerifying ? 'Verifying...' : 'Verify Code'}
        </Button>

        <div className="text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400 mb-3">Didn't receive a code?</p>
          <Button
            onClick={handleResendOtp}
            disabled={resendCooldown > 0 || isResending}
            variant="outline"
            className="w-full"
            data-testid="button-resend"
          >
            {isResending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
          </Button>
        </div>

        <Button
          onClick={onBack}
          disabled={isVerifying}
          variant="ghost"
          className="w-full"
          data-testid="button-back"
        >
          Back
        </Button>
      </CardContent>
    </Card>
  )
}
