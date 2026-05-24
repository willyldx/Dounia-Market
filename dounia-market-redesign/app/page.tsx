"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Star, 
  ChevronRight, 
  Package, 
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  ArrowRight,
  Globe,
  Users
} from "lucide-react"

export default function DesignSystemPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-sm">D</span>
            </div>
            <span className="font-serif font-semibold text-lg">Dounia Market</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#colors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Colors</a>
            <a href="#typography" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Typography</a>
            <a href="#buttons" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Buttons</a>
            <a href="#cards" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cards</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <Badge className="mb-4 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
            Design System v1.0
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
            Dounia Market
            <span className="block text-accent">Design System</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A premium, trust-focused design system for the African diaspora e-commerce platform. 
            Built with Deep Navy and Amber/Gold to convey authority and warmth.
          </p>
        </section>

        {/* Colors Section */}
        <section id="colors" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Color Palette</h2>
            <p className="text-muted-foreground">Core colors that define the Dounia Market brand identity.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-primary shadow-premium" />
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">Deep Navy</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-accent shadow-premium" />
              <p className="text-sm font-medium">Accent</p>
              <p className="text-xs text-muted-foreground">Amber/Gold</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-secondary shadow-premium border" />
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">Soft Navy</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-muted shadow-premium border" />
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Subtle</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-success shadow-premium" />
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-muted-foreground">Confirmation</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-xl bg-destructive shadow-premium" />
              <p className="text-sm font-medium">Destructive</p>
              <p className="text-xs text-muted-foreground">Error</p>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section id="typography" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Typography</h2>
            <p className="text-muted-foreground">Sora for headings, Manrope for body text.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Headings - Sora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h1 className="font-serif text-4xl font-bold">Heading 1</h1>
                <h2 className="font-serif text-3xl font-semibold">Heading 2</h2>
                <h3 className="font-serif text-2xl font-semibold">Heading 3</h3>
                <h4 className="font-serif text-xl font-medium">Heading 4</h4>
                <h5 className="font-serif text-lg font-medium">Heading 5</h5>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Body Text - Manrope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-lg leading-relaxed">Large body text for introductions and key messaging.</p>
                <p className="text-base leading-relaxed">Regular body text for content paragraphs. This is the default text size used throughout the platform.</p>
                <p className="text-sm leading-relaxed text-muted-foreground">Small text for captions, labels, and secondary information.</p>
                <p className="text-xs text-muted-foreground">Extra small for fine print and metadata.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="buttons" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Buttons</h2>
            <p className="text-muted-foreground">Interactive elements with premium feel and clear hierarchy.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Button Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Button Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><Heart /></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">With Icons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button>
                    <ShoppingCart />
                    Add to Cart
                  </Button>
                  <Button variant="outline">
                    Continue
                    <ArrowRight />
                  </Button>
                  <Button variant="secondary">
                    <Package />
                    Track Order
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled</Button>
                  <Button onClick={() => setLoading(!loading)}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Click to Load"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons - Premium Style */}
          <div className="mt-8">
            <Card className="shadow-premium bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="text-sm text-primary-foreground/70">Premium CTA Buttons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 glow-accent">
                    <CreditCard />
                    Complete Purchase
                  </Button>
                  <Button variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                    Learn More
                    <ChevronRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards Section */}
        <section id="cards" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Cards</h2>
            <p className="text-muted-foreground">Content containers with various styles for different contexts.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Product Card */}
            <Card className="shadow-premium overflow-hidden group">
              <div className="aspect-square bg-muted relative">
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                  Popular
                </Badge>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground mb-1">Food & Groceries</p>
                <h3 className="font-semibold mb-2">Premium Rice Pack (25kg)</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold">45,000 FCFA</span>
                  <span className="text-sm text-muted-foreground">~$73 USD</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            {/* Trust Card */}
            <Card className="shadow-premium">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Secure Payments</CardTitle>
                <CardDescription>
                  Your transactions are protected with bank-level security. We never store your card details.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="link" className="px-0">
                  Learn more <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Stats Card */}
            <Card className="shadow-premium bg-primary text-primary-foreground">
              <CardHeader>
                <CardDescription className="text-primary-foreground/70">Total Deliveries</CardDescription>
                <CardTitle className="text-4xl font-serif">12,847</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center text-success">
                    <Star className="h-4 w-4 mr-1" />
                    98.5%
                  </span>
                  <span className="text-primary-foreground/70">success rate</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Trust Badges */}
        <section id="trust" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Trust Elements</h2>
            <p className="text-muted-foreground">Building confidence with clear visual cues.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Trust Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <span className="trust-badge">
                    <ShieldCheck className="h-4 w-4" />
                    Verified Seller
                  </span>
                  <span className="trust-badge">
                    <Truck className="h-4 w-4" />
                    Fast Delivery
                  </span>
                  <span className="trust-badge">
                    <CheckCircle2 className="h-4 w-4" />
                    Photo Proof
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Alert Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Delivered
                  </Badge>
                  <Badge className="bg-accent/10 text-accent border-accent/20">
                    <Clock className="h-3 w-3 mr-1" />
                    In Transit
                  </Badge>
                  <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Issue
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Info className="h-3 w-3 mr-1" />
                    Info
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inputs Section */}
        <section id="inputs" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Form Elements</h2>
            <p className="text-muted-foreground">Clean, accessible inputs for seamless user experience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Text Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Name</label>
                  <Input placeholder="Enter full name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="+235 XX XX XX XX" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="N'Djamena, Chad" className="pl-10" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Input States</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default</label>
                  <Input placeholder="Default input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Disabled</label>
                  <Input placeholder="Disabled input" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">With Error</label>
                  <Input placeholder="Invalid input" aria-invalid="true" />
                  <p className="text-sm text-destructive">Please enter a valid value.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Glassmorphism Section */}
        <section id="glass" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Glassmorphism</h2>
            <p className="text-muted-foreground">Subtle frosted glass effects for elevated surfaces.</p>
          </div>

          <div className="relative rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
            
            <div className="relative grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h3 className="font-serif text-lg font-semibold mb-2">Glass Card</h3>
                <p className="text-sm text-muted-foreground">
                  Subtle backdrop blur with semi-transparent background for layered UI elements.
                </p>
              </div>
              <div className="glass-strong rounded-xl p-6">
                <h3 className="font-serif text-lg font-semibold mb-2">Strong Glass</h3>
                <p className="text-sm text-muted-foreground">
                  Higher opacity and stronger blur for more prominent floating elements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section id="features" className="mb-20">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold mb-2">Feature Showcase</h2>
            <p className="text-muted-foreground">Combining elements to create compelling UI patterns.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                  <Globe className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="font-serif">Global Reach</CardTitle>
                <CardDescription className="leading-relaxed">
                  Send essentials to your family from anywhere in the world. We handle the logistics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-7 w-7 text-success" />
                </div>
                <CardTitle className="font-serif">Verified Delivery</CardTitle>
                <CardDescription className="leading-relaxed">
                  Photo proof of every delivery. Track your package in real-time on our Radar.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-premium-lg border-0 bg-gradient-to-br from-card to-secondary/30">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="font-serif">Family First</CardTitle>
                <CardDescription className="leading-relaxed">
                  Built by the diaspora, for the diaspora. We understand what your family needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">D</span>
              </div>
              <span className="font-serif font-semibold">Dounia Market</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              Design System v1.0 - Premium E-commerce for African Diaspora
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
