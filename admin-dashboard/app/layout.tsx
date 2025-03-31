import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider } from "antd";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import AuthProvider from "../lib/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-commerce Admin Dashboard",
  description: "Admin dashboard for managing e-commerce store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <StyledComponentsRegistry>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1677ff",
                },
              }}
            >
              {children}
            </ConfigProvider>
          </StyledComponentsRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
