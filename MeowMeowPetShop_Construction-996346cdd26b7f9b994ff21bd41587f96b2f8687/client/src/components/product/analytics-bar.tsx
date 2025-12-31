import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, TrendingUp, Star, Trophy } from 'lucide-react'
import { getCategoryAnalytics } from '@/lib/product-data'
import { cn } from '@/lib/utils'

interface AnalyticsBarProps {
  categoryId: string
  className?: string
}

export default function AnalyticsBar({ categoryId, className }: AnalyticsBarProps) {
  const analytics = getCategoryAnalytics(categoryId)

  if (!analytics.lowestPriced) {
    return null
  }

  const analyticsItems = [
    {
      icon: TrendingDown,
      title: 'Lowest Priced',
      product: analytics.lowestPriced,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Highest Priced',
      product: analytics.highestPriced,
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Star,
      title: 'Highest Rated',
      product: analytics.highestRated,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: Trophy,
      title: 'Best Seller',
      product: analytics.bestSeller,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8', className)}>
      {analyticsItems.map((item, index) => {
        const Icon = item.icon
        const product = item.product

        if (!product) return null

        return (
          <Card 
            key={index} 
            className={cn(
              'hover-lift animate-fade-in border-l-4',
              item.bgColor,
              item.iconColor.replace('text-', 'border-')
            )}
            style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className={cn('p-2 rounded-full', item.bgColor.replace('50', '100'))}>
                  <Icon size={20} className={item.iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">{item.title}</p>
                  <h4 className="font-semibold text-[#26732d] text-sm mb-2 line-clamp-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#26732d]">
                      ৳{product.price.toLocaleString()}
                    </span>
                    {item.title === 'Highest Rated' && (
                      <Badge variant="secondary" className="text-xs">
                        {product.rating} ⭐
                      </Badge>
                    )}
                    {item.title === 'Best Seller' && product.isBestSeller && (
                      <Badge className="bg-yellow-500 text-white text-xs">
                        Best
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}