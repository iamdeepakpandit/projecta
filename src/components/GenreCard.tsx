import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Genre } from '../types/music';

interface GenreCardProps {
  genre: Genre;
}

export default function GenreCard({ genre }: GenreCardProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/genre/${genre.id}`)}
      className="relative overflow-hidden rounded-lg group cursor-pointer"
    >
      <div className="aspect-square">
        <img 
          src={genre.coverUrl} 
          alt={genre.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <h3 className="text-white text-xl font-bold p-6 w-full">{genre.name}</h3>
        </div>
      </div>
    </div>
  );
}