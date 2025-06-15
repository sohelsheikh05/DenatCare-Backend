import Header from "./components/Header.jsx"
import Hero from "./components/Hero.jsx"
import Problem from "./components/Problem.jsx"
import Solution from "./components/Solution.jsx"
import Contact from "./components/Contact.jsx"
import Footer from "./components/Footer.jsx"
import "./Landing.css"

function Landing() {
  return (
    <div className="App">
        

      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Contact />
      <Footer />
    </div>
  )
}

export default Landing

