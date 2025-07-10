'use client';

export default function Copyright() {
  return (
    <div className='pt-4 capsTitle border-t border-(--border-color)'>
      ΞthBlox © {new Date().getFullYear()}. All rights reserved.
    </div>
  );
}