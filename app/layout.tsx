import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SpotMe — Date people who actually train',
  description: 'Fitness-based dating. Matched by goals. Verified by sweat.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'SpotMe' },
}

export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 1,
  userScalable: false, viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="app" style={{ width:'100%',height:'100%',display:'flex',alignItems:'flex-start',justifyContent:'center' }}>
          <div id="shell" style={{ width:'100%',maxWidth:430,height:'100dvh',background:'var(--bg)',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',margin:'0 auto' }}>
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
