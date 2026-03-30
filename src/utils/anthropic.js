import Anthropic from '@anthropic-ai/sdk'

export async function* sugerirEstrategia({ cliente, clientesSimilares, apiKey }) {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const contextoSimilares = clientesSimilares.length > 0
    ? clientesSimilares.map((c, i) => `
Cliente anterior ${i + 1}: ${c.empresa}
- Tamaño: ${c.tamano}
- Presupuesto: ${c.presupuesto}
- Objetivos: ${c.objetivos}
- Estrategia aplicada: ${c.estrategia || 'No registrada'}
- Resultados obtenidos: ${c.resultados || 'No registrados'}
`.trim()).join('\n\n')
    : 'No hay clientes previos registrados en esta industria.'

  const industria = cliente.industria === 'Otra'
    ? (cliente.industriaPersonalizada || 'Otra')
    : cliente.industria

  const prompt = `Eres un consultor de negocios experto especializado en la industria de ${industria}.

Tu tarea es sugerir una estrategia personalizada para el siguiente cliente nuevo, basándote en el historial de clientes similares y sus resultados.

## CLIENTE NUEVO
- Empresa: ${cliente.empresa}
- Tamaño: ${cliente.tamano}
- Presupuesto disponible: ${cliente.presupuesto}
- Objetivos declarados: ${cliente.objetivos}

## HISTORIAL DE CLIENTES EN LA MISMA INDUSTRIA (${industria})
${contextoSimilares}

## INSTRUCCIONES
Basándote en los patrones observados en clientes anteriores de la industria ${industria}, proporciona:

1. **Diagnóstico**: Análisis breve de los desafíos típicos en esta industria para empresas del tamaño y presupuesto indicados.
2. **Estrategia Recomendada**: Pasos concretos y accionables adaptados a los objetivos del cliente.
3. **Tácticas Prioritarias**: Las 3-5 acciones más importantes a implementar primero, con justificación basada en los resultados de clientes anteriores.
4. **Consideraciones de Presupuesto**: Cómo distribuir el presupuesto de ${cliente.presupuesto} de manera efectiva.
5. **KPIs Sugeridos**: Métricas clave para medir el éxito de la estrategia.

Responde en español, de manera profesional y directa. Basa tus recomendaciones explícitamente en los patrones observados en los clientes anteriores cuando sea relevante.`

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}
