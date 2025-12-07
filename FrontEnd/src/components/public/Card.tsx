const Card = ({ children, title, actionButton, className = '' }: React.PropsWithChildren<{
  title?: string;
  actionButton?: React.ReactNode;
  className?: string;
}>) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 ${className}`}>
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {actionButton}
      </div>
    )}
    {children}
  </div>
);

export default Card;