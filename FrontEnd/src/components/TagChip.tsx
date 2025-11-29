const TagChip = ({ children }: React.PropsWithChildren) => (
  <span className="inline-flex items-center px-3 py-1 mr-2 mb-2 text-sm font-medium bg-red-100 text-red-700 rounded-full">
    {children}
  </span>
  );

export default TagChip;