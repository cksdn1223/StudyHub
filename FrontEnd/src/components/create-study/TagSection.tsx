import InputField from "../public/InputField";

export function TagSection({
  tag, setTag, tags,
  filteredTags, isFocused, onFocus, onBlur,
  addTag, removeTag,
}: {
  tag: string;
  setTag: (v: string) => void;
  tags: string[];
  filteredTags: string[];
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  addTag: (t: string) => void;
  removeTag: (t: string) => void;
}) {
  return (
    <div className="relative">
      <div className="flex items-end gap-2">
        <InputField
          placeholder="기술 스택을 입력하고 Enter를 누르세요"
          fullWidth
          label=""
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag(tag);
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button
          onClick={() => addTag(tag)}
          className="flex-shrink-0 px-4 py-3 text-sm font-medium bg-red-400 text-white rounded-lg hover:bg-red-500"
        >
          추가
        </button>
      </div>

      {(filteredTags.length > 0 && isFocused) && (
        <div className="absolute z-10 w-[calc(100%-70px)] bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
          {filteredTags.map((item) => (
            <div
              key={item}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(item);
              }}
              className="px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-red-50 hover:text-red-600"
            >
              {item}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">현재 태그:</p>
        <div className="flex flex-wrap">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex hover:cursor-pointer items-center px-3 py-1 mr-2 mb-2 text-sm font-medium bg-red-100 text-red-700 rounded-full"
              onClick={() => removeTag(t)}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
