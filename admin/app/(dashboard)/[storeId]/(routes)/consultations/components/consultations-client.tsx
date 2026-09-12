'use client'

import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React, { Fragment } from 'react'
import { RankingColumn, rankingColumns } from './ranking-columns'
import { HistoryColumn, historyColumns } from './history-columns'

interface IConsultationsClient {
  ranking: Array<RankingColumn>
  history: Array<HistoryColumn>
  total: number
}

function ConsultationsClient({ ranking, history, total }: IConsultationsClient) {
  return (
    <Fragment>
      <Heading
        title={`Consultas (${total})`}
        description='Cada vez que alguien aprieta "Consultar" en la tienda queda registrado acá'
      />
      <Separator />

      <Heading isDetail title='Productos más consultados' description='Ordenados por cantidad de personas distintas que preguntaron' />
      <DataTable
        searchKey={['name', 'SKU']}
        searchPlaceholder='Buscar por nombre o SKU...'
        columns={rankingColumns}
        data={ranking}
      />

      <Separator />

      <Heading isDetail title='Historial' description='Las últimas 200 consultas, de la más reciente a la más antigua' />
      <DataTable
        searchKey={['name', 'SKU']}
        searchPlaceholder='Buscar por nombre o SKU...'
        columns={historyColumns}
        data={history}
      />
    </Fragment>
  )
}

export default ConsultationsClient
