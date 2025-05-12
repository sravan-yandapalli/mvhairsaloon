
import BookAppointment from './appointment/book';
import { Navbar } from './navbar'; 
import Service from './service/service';
import Footer from './fotter/fotter';

export default function Home() {
  return (
    <>
      <Navbar />
      <Service />
      <BookAppointment />
      <Footer />
    </>
  );
}
