import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardBody } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { generatePageSEO } from '@/lib/seo'
import { Calendar, Clock, ArrowRight, Search } from 'lucide-react'

export const metadata: Metadata = generatePageSEO({
  title: 'Blog - Inspirations et Conseils Voyage',
  description: 'Découvrez nos articles sur les voyages surprise, destinations mystères, conseils de préparation et témoignages de voyageurs.',
  path: '/blog',
})

// Mock blog posts
const blogPosts = [
  {
    slug: 'comment-choisir-theme-voyage-mystere',
    title: 'Comment choisir son thème pour un voyage mystère réussi',
    excerpt: 'Romantique, Nature ou Urbain ? Découvrez comment sélectionner la thématique parfaite selon vos envies et votre personnalité.',
    category: 'Conseils',
    readTime: '5 min',
    date: '2024-11-01',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop',
    featured: true,
  },
  {
    slug: 'top-10-destinations-romantiques-france',
    title: 'Top 10 des destinations romantiques en France',
    excerpt: 'De la côte normande aux châteaux de la Loire, découvrez les lieux les plus romantiques pour un week-end en amoureux.',
    category: 'Destinations',
    readTime: '7 min',
    date: '2024-10-28',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'preparer-voyage-surprise-checklist',
    title: 'Préparer un voyage surprise : la checklist ultime',
    excerpt: 'Tous nos conseils pour ne rien oublier avant votre départ en voyage mystère : documents, valise, et état d\'esprit !',
    category: 'Conseils',
    readTime: '6 min',
    date: '2024-10-25',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'temoignage-voyage-mystere-nature',
    title: 'Témoignage : Notre week-end Nature dans les Vosges',
    excerpt: 'Sophie et Thomas racontent leur aventure en cabane perchée et leurs découvertes inattendues en pleine forêt.',
    category: 'Témoignages',
    readTime: '4 min',
    date: '2024-10-20',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'destinations-insolites-france-2024',
    title: '5 destinations insolites à découvrir en France en 2024',
    excerpt: 'Sortez des sentiers battus avec notre sélection de lieux uniques et méconnus pour un voyage hors du commun.',
    category: 'Destinations',
    readTime: '8 min',
    date: '2024-10-15',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=500&fit=crop',
    featured: false,
  },
  {
    slug: 'offrir-voyage-mystere-cadeau-original',
    title: 'Offrir un voyage mystère : le cadeau qui marque les esprits',
    excerpt: 'Pourquoi offrir un voyage surprise est le cadeau parfait pour un anniversaire, un mariage ou une occasion spéciale.',
    category: 'Conseils',
    readTime: '5 min',
    date: '2024-10-10',
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=500&fit=crop',
    featured: false,
  },
]

const categories = ['Tous', 'Destinations', 'Conseils', 'Témoignages']

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
            Blog Voyage Mystère
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conseils, inspirations et témoignages pour préparer votre aventure mystère
          </p>
        </div>

        {/* Search & Categories */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'Tous' ? 'primary' : 'outline'}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`}>
            <Card className="mb-12 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div
                  className="h-64 lg:h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${featuredPost.image})` }}
                />
                <CardBody className="p-8 lg:p-12">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="primary">{featuredPost.category}</Badge>
                    <Badge variant="default">⭐ Article en vedette</Badge>
                  </div>
                  <h2 className="text-3xl font-display font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-700 text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(featuredPost.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {featuredPost.readTime} de lecture
                    </span>
                  </div>
                  <div className="mt-6">
                    <Button variant="primary">
                      Lire l'article
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardBody>
              </div>
            </Card>
          </Link>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div
                  className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{ backgroundImage: `url(${post.image})` }}
                />
                <CardBody className="p-6">
                  <Badge variant="primary" className="mb-3">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <Card className="mt-16 bg-gradient-to-br from-primary-50 to-accent-50">
          <CardBody className="p-12 text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Restez inspiré ! 💌
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Recevez chaque mois nos meilleurs conseils voyage, nos nouvelles destinations mystères et des offres exclusives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
              <Button variant="primary" size="lg">
                S'abonner
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              Désabonnement possible à tout moment. Vos données sont protégées.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
