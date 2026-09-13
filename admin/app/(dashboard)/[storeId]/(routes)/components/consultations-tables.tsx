'use client'

import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import React, { Fragment } from 'react'
import { RankingColumn, rankingColumns } from './ranking-columns'
import { HistoryColumn, historyColumns } from './history-columns'

interface IConsultationsTables {
  ranking: Array<RankingColumn>
  history: Array<HistoryColumn>
}

function ConsultationsTables({ ranking, history }: IConsultationsTables) {
  return (
    <Fragment>
      <Heading
        title='Productos más consultados'
        description='Ordenados por cantidad de personas distintas que preguntaron'
      />
      <DataTable searchKey={['name', 'SKU']} searchPlaceholder='Buscar por nombre o SKU...' columns={rankingColumns} data={ranking} />

      <Heading title='Últimas consultas' description='De la más reciente a la más antigua, en hora argentina' />
      <DataTable searchKey={['name', 'SKU']} searchPlaceholder='Buscar por nombre o SKU...' columns={historyColumns} data={history} />
    </Fragment>
  )
}

export default ConsultationsTables
