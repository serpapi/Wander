"use client"

import cx from "classnames"
import useMap from '@/app/hooks/useMap';

export default function Map({ className }) {
  useMap()

  return <div id='map' className={cx('w-full h-full rounded-lg', className)}></div>
}