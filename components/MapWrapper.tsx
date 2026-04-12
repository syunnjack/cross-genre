"use client";
import { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface MapWrapperProps {
    lat: number;
    lng: number;
    city: string;
}

export default function MapWrapper({ lat, lng, city }: MapWrapperProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
            version: "weekly",
        });

        loader.load().then(() => {
            if (mapRef.current) {
                new google.maps.Map(mapRef.current, {
                    center: { lat, lng },
                    zoom: 12,
                });
            }
        });
    }, [lat, lng]);

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    background: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
            >
                {city}周辺の対応業者
            </div>
        </div>
    );
}
