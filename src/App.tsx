import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Screen1 from "./onboarding/screen1";
import Screen2 from "./onboarding/screen2";

import "./App.css";

// import { AuthScreen } from './page/screen3';
import Screen5 from "./onboarding/screen5";
// import Screen4 from './onboarding/screen4';
import Screen6 from "./onboarding/screen6";
import Screen7 from "./onboarding/screen7";

import AppLayout from "./layouts/AppLayout";

import TransactionsPage from "./components/transactions/TransactionsPage";
import BookRidePage from "./pages/app/bookride/BookRidePage";
import AvailableRides from "./pages/app/bookride/AvailableRides";
import RideDetailsPage from "./pages/app/bookride/RideDetailsPage";
import MakePaymentPage from "./pages/app/bookride/MakePaymentPage";
import PaymentSuccess from "./pages/app/bookride/PaymentSuccess";
import ProfilePage from "./pages/ProfilePage";
import SupportPage from "./pages/SupportPage";
import EditProfilePage from "./components/profile/EditProfilePage";
import RewardsPage from "./pages/RewardsPage";
import Dashboard from "./pages/Dashboard";
import BookMarketplacePage from "./components/bookmarket/bookmarketplace";
import BookDetailPage from "./components/bookmarket/bookDetailPage";
import ReaderPage from "./components/bookmarket/components/readpage";
function App() {
  useEffect(() => {
    const warmUp = async () => {
      try {
        await fetch("https://team-7-api.onrender.com", { cache: "no-store" });
        console.log("✅ Backend warmed up and ready");
      } catch (error) {
        console.log("⚠ Warm-up failed — backend may still be waking up");
      }
    };
    warmUp();
  }, []);
  return (
    // <Provider store={store}>
    //   <BrowserRouter>
    //     <Routes>
    //       {/* Onboarding flow */}
    //       <Route path="/" element={<Screen1 />} />
    //       <Route path="/welcome" element={<Screen2 />} />
    //       {/* <Route path="/auth" element={<AuthScreen />} /> */}
    //       {/* <Route path="/verify-code" element={<Screen4 />} /> */}
    //       <Route path="/signup" element={<Screen5 />} />
    //       <Route path="/login" element={<Screen6 />} />
    //       <Route path="/success" element={<Screen7 />} />


    //       <Route path="*" element={<Navigate to="/" replace />} />
    //     </Routes>
    //   </BrowserRouter>

    // </Provider>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Onboarding flow */}
          <Route path="/" element={<Screen1 />} />
          <Route path="/welcome" element={<Screen2 />} />
          {/* <Route path="/auth" element={<AuthScreen />} /> */}
          {/* <Route path="/verify-code" element={<Screen4 />} /> */}
          <Route path="/signup" element={<Screen5 />} />
          <Route path="/login" element={<Screen6 />} />
          <Route path="/success" element={<Screen7 />} />

          <Route path="/book-ride" element={<BookRidePage />} />
          <Route path="/available-rides" element={<AvailableRides />} />
          <Route path="/ride-details" element={<RideDetailsPage />} />
          <Route path="/ride-payment" element={<MakePaymentPage />} />
          <Route path="/ride-payment-success" element={<PaymentSuccess />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/book-market" element={<BookMarketplacePage />} />
          <Route path="/reader/:id" element={<ReaderPage />} />


          <Route path="/book/:id" element={<BookDetailPage />} />

          {/* APP ROUTES */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
