'use client'

import { DataTable } from '@/components/ui/data-table'
import { HistoryColumn, historyColumns } from './history-columns'
import { PanelCardHeader } from './panel-card'

interface IConsultationsTables {
  history: Array<HistoryColumn>
}

// El título va dentro de la tarjeta, como en el resto del Panel, y no como un encabezado de página suelto.
function ConsultationsTables({ history }: IConsultationsTables) {
  return (
    <DataTable
      header={
        <PanelCardHeader title='Últimas consultas' description='De la más reciente a la más antigua, en hora argentina' />
      }
      searchKey={['name', 'SKU', 'brand']}
      searchPlaceholder='Buscar por nombre, SKU o marca...'
      columns={historyColumns}
      data={history}
    />
  )
}

export default ConsultationsTables
