import { Box } from "@chakra-ui/react"
import { Outlet } from "react-router-dom"
import Navbar from "../component/Navbar"
import Footer from "../component/Footer"

export default function RootLayout() {
  return (
    <Box bg="black" minH="100vh">
      <Navbar />
      <Outlet />
      <Footer />
    </Box>
  )
}
