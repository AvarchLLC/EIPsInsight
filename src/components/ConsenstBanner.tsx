import CookieConsent from "react-cookie-consent";

const ConsentBanner = () => {
    console.log("consent request recieved");
  const handleAccept = () => {
    // Enable analytics if user consents
    window.gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted",
    });
  };

  const handleDecline = () => {
    // Disable analytics if user declines
    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
    });
  };

  return (
    <CookieConsent
  onAccept={handleAccept}
  onDecline={handleDecline}
  enableDeclineButton
  buttonText="Accept"
  declineButtonText="Decline"
  style={{
    position: 'fixed',
    bottom: '0',
    left: '0',
    width: 'auto',
    textAlign: 'left',
    padding: '10px',
  }}
  buttonStyle={{
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
  }}
  declineButtonStyle={{
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
  }}
>
  We use cookies to improve your experience. By accepting, you consent to our analytics and tracking.
</CookieConsent>

  );
};

export default ConsentBanner;
