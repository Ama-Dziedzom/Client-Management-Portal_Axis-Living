'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../studio-axis-living/sanity.config'

export default function StudioPage() {
    return <NextStudio config={config} />
}
