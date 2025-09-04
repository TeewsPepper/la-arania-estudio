
import styles from'./Layout.module.css'
import logoBg from '../../assets/images/logo-bg-transparent.png';
import { Outlet } from "react-router-dom"
import Footer from '../footer/Footer';
import Navbar from '../navbar/Navbar';
import SocialNavbar from '../social/SocialNavbar';
import MapSection from './mapSection/MapSection';


const Layout: React.FC = () => {
  return (
    <div className={styles.container}>
      <img 
        src={logoBg} 
        alt="Fondo La Araña" 
        className={styles.backgroundLogo} 
      />
      <Navbar />
      
      <main>{<Outlet/>}</main>
      <SocialNavbar />
      <MapSection/>
      <Footer />
    </div>
  );
};

export default Layout;