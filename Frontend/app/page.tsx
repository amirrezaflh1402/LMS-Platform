import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserDropdown } from "@/components/user-dropdown"
import { BookOpen, Users, Award, Clock, TrendingUp, Shield, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">LearnHub</h1>
            </div>
            <UserDropdown />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Over 50,000+ Students Learning
          </Badge>
          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Master New Skills with
            <span className="text-primary"> Expert-Led Courses</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Join thousands of learners advancing their careers with our comprehensive online courses. Learn from
            industry experts, track your progress, and earn certificates that matter.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Link href="/courses">
              <Button size="lg" className="px-8">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="px-8 bg-transparent">
                Start Learning Free
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Why Choose LearnHub?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed in your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expert Instructors</CardTitle>
                <CardDescription>
                  Learn from industry professionals with 10+ years of real-world experience in their fields
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Flexible Learning</CardTitle>
                <CardDescription>
                  Study at your own pace with lifetime access to course materials and mobile-friendly content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Monitor your learning journey with detailed analytics, quizzes, and achievement badges
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>
                  Earn industry-recognized certificates upon course completion to boost your career prospects
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quality Guaranteed</CardTitle>
                <CardDescription>
                  30-day money-back guarantee and continuously updated content to ensure the best learning experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Global Community</CardTitle>
                <CardDescription>
                  Join a worldwide community of learners and connect with peers in discussion forums
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">Your Learning Journey</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow our proven 4-step process to master new skills effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Choose Your Course</h4>
              <p className="text-muted-foreground text-sm">
                Browse our extensive catalog and select courses that match your goals and skill level
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Learn & Practice</h4>
              <p className="text-muted-foreground text-sm">
                Watch video lessons, complete hands-on exercises, and test your knowledge with quizzes
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
              <p className="text-muted-foreground text-sm">
                Monitor your advancement with detailed analytics and earn badges for milestones
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="text-lg font-semibold mb-2">Get Certified</h4>
              <p className="text-muted-foreground text-sm">
                Complete your course and receive a certificate to showcase your new skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of successful learners who have transformed their careers with LearnHub
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/courses">
              <Button size="lg" variant="secondary" className="px-8">
                Explore Courses
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold text-foreground">LearnHub</h1>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering learners worldwide with high-quality online education.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-foreground">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-foreground">
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-foreground">
                    Design
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-foreground">
                    Business
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
