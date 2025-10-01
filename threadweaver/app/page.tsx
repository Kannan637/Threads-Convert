import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Zap, TrendingUp, Clock } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/subscription'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <span className="text-2xl font-bold text-slate-900">ThreadWeaver</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          AI-Powered Thread Generation
        </Badge>
        <h1 className="text-6xl font-bold text-slate-900 mb-6">
          Turn Your Content Into
          <br />
          <span className="text-blue-600">Engaging Threads</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Transform long-form content into viral social media threads in 30 seconds.
          Optimized for Twitter and LinkedIn with AI-powered engagement suggestions.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/api/auth/signin">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="text-lg px-8">
              See Demo
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-blue-600">30s</div>
            <div className="text-slate-600">Average Generation Time</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">10x</div>
            <div className="text-slate-600">More Engagement</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600">50k+</div>
            <div className="text-slate-600">Threads Created</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why ThreadWeaver?</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Generate optimized threads in seconds, not hours. AI does the heavy lifting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                GPT-4 maintains narrative flow and engagement while splitting your content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Optimized</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Best posting times, hashtag suggestions, and engagement predictions.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="h-10 w-10 text-blue-600 mb-2" />
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Stop manually splitting content. Focus on creating, not formatting.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
        <p className="text-center text-slate-600 mb-12">Choose the plan that fits your needs</p>
        
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
            <Card key={key} className={key === 'pro' ? 'border-blue-600 border-2 relative' : ''}>
              {key === 'pro' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-blue-600">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>
                  <span className="text-4xl font-bold text-slate-900">${tier.price}</span>
                  {tier.price > 0 && <span className="text-slate-600">/month</span>}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/api/auth/signin" className="w-full">
                  <Button 
                    className="w-full" 
                    variant={key === 'pro' ? 'default' : 'outline'}
                  >
                    {tier.price === 0 ? 'Get Started' : 'Subscribe'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Create Engaging Threads?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of content creators using ThreadWeaver
            </p>
            <Link href="/api/auth/signin">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-slate-900">ThreadWeaver</span>
            </div>
            <p className="text-slate-600 text-sm">
              © 2025 ThreadWeaver. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/contact" className="hover:text-slate-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
