/** Encabezado de las tarjetas del Panel: título chico y descripción, separado del contenido. */
export function PanelCardHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className='border-b border-slate-100 px-5 py-4'>
      <h2 className='text-[15px] font-semibold text-slate-900'>{title}</h2>
      {description && <p className='mt-0.5 text-sm text-slate-500'>{description}</p>}
    </header>
  )
}

export function PanelCard({
  title,
  description,
  className,
  children,
}: {
  title: string
  description?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className ?? ''}`}>
      <PanelCardHeader title={title} description={description} />
      <div className='p-5'>{children}</div>
    </section>
  )
}
