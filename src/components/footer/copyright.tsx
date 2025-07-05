'use client';

export default function Copyright() {
  return (
    <div className='pt-4 text-sm tracking-wider text-(--grey-fg-color) border-t border-(--border-color)'>
      ΞthBlox © {new Date().getFullYear()}. All rights reserved.
    </div>
  );
}