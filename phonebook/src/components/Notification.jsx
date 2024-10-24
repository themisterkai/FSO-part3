const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  if (isError) {
    console.log('here in isError', message, isError);
    return <div className="error">{message}</div>;
  }
  return <div className="message">{message}</div>;
};

export default Notification;
