// src/utils/imageHelper.js
const API_BASE_URL = 'https://used-edyth-freelence-0891ef2c.koyeb.app';

/**
 * Corrige les URLs des images en remplaçant localhost par l'URL de production
 * @param {string} url - L'URL de l'image à corriger
 * @returns {string|null} - L'URL corrigée ou null
 */
export const getImageUrl = (url) => {
  if (!url) return null;
  
  // Si l'URL contient localhost ou 127.0.0.1
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Remplacer par l'URL de production
    return url.replace(/http:\/\/[^\/]+/, API_BASE_URL);
  }
  
  // Si l'URL commence par /storage
  if (url.startsWith('/storage')) {
    return `${API_BASE_URL}${url}`;
  }
  
  // Si l'URL est déjà complète avec un autre domaine
  return url;
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
  };

  const handleLoad = () => {
    setLoading(false);
    console.log('✅ Image chargée:', src);
  };

  const retry = () => {
    setError(false);
    setLoading(true);
    setSrc(getImageUrl(initialSrc));
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