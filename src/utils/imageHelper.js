// src/utils/imageHelper.js
const API_BASE_URL = 'https://used-edyth-freelence-0891ef2c.koyeb.app';

/**
 * Corrige les URLs des images en remplaçant localhost par l'URL de production
 * et en construisant les URLs complètes pour les chemins relatifs
 * @param {string} url - L'URL de l'image à corriger
 * @returns {string|null} - L'URL corrigée ou null
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Si c'est déjà une URL complète (http, https, data:)
  if (url.startsWith('http') || url.startsWith('https') || url.startsWith('data:')) {
    return url;
  }
  
  // Si l'URL contient localhost ou 127.0.0.1 (anciennes données)
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return url.replace(/http:\/\/[^\/]+/, API_BASE_URL);
  }
  
  // Si l'URL commence par /storage
  if (url.startsWith('/storage')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Si l'URL commence par storage/ (sans le slash)
  if (url.startsWith('storage/')) {
    return `${API_BASE_URL}/${url}`;
  }
  
  // Si c'est un chemin comme photos/directeur/...
  if (url.includes('/')) {
    return `${API_BASE_URL}/storage/${url}`;
  }
  
  // Si c'est juste un nom de fichier
  return `${API_BASE_URL}/storage/${url}`;
};

/**
 * Hook personnalisé pour gérer les images avec fallback
 * @param {string} initialSrc - L'URL initiale de l'image
 * @returns {Object} - Les propriétés et gestionnaires pour l'image
 */
import { useState } from 'react';

export const useImage = (initialSrc) => {
  const [src, setSrc] = useState(getImageUrl(initialSrc));
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    setError(true);
    setLoading(false);
    console.log('❌ Erreur chargement image:', initialSrc);
    console.log('URL tentée:', src);
  };

  const handleLoad = () => {
    setLoading(false);
    console.log('✅ Image chargée:', src);
  };

  const retry = () => {
    setError(false);
    setLoading(true);
    const newUrl = getImageUrl(initialSrc);
    setSrc(newUrl);
    console.log('🔄 Nouvelle tentative:', newUrl);
  };

  return {
    src: error ? null : src,
    error,
    loading,
    handleError,
    handleLoad,
    retry
  };
};

export default getImageUrl;