export default function PageHeader(props: { icon: any, title: string, subtitle: string }) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
          <props.icon className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        {props.title}
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        {props.subtitle}
      </p>
    </div>
  )
}