"use client"

import * as maptilersdk from '@maptiler/sdk';
import { useEffect } from 'react';
import cx from "classnames"

maptilersdk.config.apiKey = 'TwDPXTUT5y62rnrJfTxN';

export default function Map({ className }) {
  useEffect(() => {
    window.map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element to render the map
      style: "streets-v2",
      center: [16.62662018, 49.2125578], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });
  }, [])

  return <div id='map' className={cx('w-full h-full rounded-lg', className)}></div>
}