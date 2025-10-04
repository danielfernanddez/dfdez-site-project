import React from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import './VideoSection.css';

const VideoSection = () => {
    return (
        <section className="VideoSection">
            <h2 className="VideoSection-title">Unique Team - Hip Hop International Championship</h2>
            <div className="VideoSection-wrapper">
                <LiteYouTubeEmbed 
                    id="iAyDF1vj604"
                    title="Unique - Spain | MegaCrew Division | 2025 World Hip Hop Dance Championship Semifinals"
                    params='enablejsapi=1'
                />
            </div>
        </section>
    );
};

export default VideoSection;

