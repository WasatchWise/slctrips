import { useState, useEffect } from "react";
import { MapPin, Clock, Car, Users, Camera, Mountain, Utensils, Calendar, Shield, Router, Zap, Heart, Info, CheckCircle, AlertTriangle, MapIcon, Navigation, Music, Film, Gem, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { DestinationTemplateType, getTemplateColors, getTemplateDisplayName } from "../utils/destination-template-detector";
import { getDestinationPhoto } from '../utils/photo-enhancement';
import { getPhotoUrl, getMainPhoto } from '../utils/getPhotoUrl';
import ArtsEntertainmentTemplate from './category-templates/ArtsEntertainmentTemplate';
import MovieMediaTemplate from './category-templates/MovieMediaTemplate';
import CategoryTemplateEngine from './CategoryTemplateEngine';
import { Destination } from '../types/destination-types';

interface DestinationTemplateProps {
  destination: Destination;
  templateType: DestinationTemplateType;
}

export function DestinationTemplate({ destination, templateType }: DestinationTemplateProps) {
  // Use Category Template Engine for all templates
  return (
    <CategoryTemplateEngine destination={destination} />
  );
}