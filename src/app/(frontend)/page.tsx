import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  const getRich = async () => {
    return (await payload.find({
      collection: "richText"
    })).docs[0] || undefined;
  }

  const doc = await getRich();

  return (
    <div className="home">
      <div className="content">
        {doc && <div className='Content' dangerouslySetInnerHTML={{ __html: doc.textHtml as string }}></div>}
      </div>
    </div>
  )
}
