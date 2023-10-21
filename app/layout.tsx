import "styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import { Providers } from "./provider";

const roboto = localFont({
  src: "../public/assets/RobotoCondensed-VariableFont_wght.ttf",
  display: "swap",
  variable: "--font-roboto-mono",
});
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html
        lang="en"
        suppressHydrationWarning={true}
        className={`${roboto.variable} ${inter.variable}`}
      >
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </Providers>
  );
}
