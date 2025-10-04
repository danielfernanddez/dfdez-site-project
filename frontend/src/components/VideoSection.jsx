import React from 'react';
import './VideoSection.css';

const VideoSection = () => {
    return (
        <section className="VideoSection">
            <h2 className="VideoSection-title">Unique Team - Hip Hop International Championship</h2>
            <div className="VideoSection-wrapper">
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/iAyDF1vj604?enablejsapi=1" 
                    title="Unique - Spain | MegaCrew Division | 2023 World Hip Hop Dance Championship Semis" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                ></iframe>
            </div>
        </section>
    );
};

export default VideoSection;


