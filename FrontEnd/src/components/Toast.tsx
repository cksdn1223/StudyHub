const Toast = ({ message, isVisible }: { message: string; isVisible: boolean }) => (
  <div
    className={`fixed bottom-10 right-10 p-4 rounded-lg shadow-xl text-white transition-opacity duration-300 z-50 
      ${isVisible ? 'opacity-100 bg-red-500' : 'opacity-0 bg-red-500 pointer-events-none'}`}
  >
    {message}
  </div>
);

export default Toast;