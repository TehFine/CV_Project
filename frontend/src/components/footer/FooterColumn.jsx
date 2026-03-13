export default function FooterColumn({ title, items }) {
  return (
    <div>

      <h3 className="text-white font-semibold mb-4">
        {title}
      </h3>

      <ul className="space-y-3 text-gray-400 text-sm">

        {items.map((item, index) => (
          <li
            key={index}
            className="hover:text-white cursor-pointer transition"
          >
            {item}
          </li>
        ))}

      </ul>

    </div>
  )
}