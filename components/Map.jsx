"use client"

import * as maptilersdk from '@maptiler/sdk';
import { useEffect } from 'react';
import cx from "classnames"

maptilersdk.config.apiKey = 'TwDPXTUT5y62rnrJfTxN';

export default function Map({ className }) {
  useEffect(() => {
    window.map = new maptilersdk.Map({
      container: 'map',
      style: "streets-v2",
      center: [-97.74242805297416, 30.270557801221628],
      zoom: 14,
    })
  }, [])

  return <div id='map' className={cx('w-full h-full rounded-lg', className)}></div>
}