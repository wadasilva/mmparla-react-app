import React from 'react';

const iframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3080.666977265592!2d-0.3776721842966234!3d39.454258421531534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd604f2d5a920aa3%3A0xf5e0704e226b7838!2sCarrer%20de%20Juan%20Ram%C3%B3n%20Jim%C3%A9nez%2C%2031%2C%2046004%20Val%C3%A8ncia!5e0!3m2!1ses!2ses!4v1617729386522!5m2!1ses!2ses" width="100%" height="500" style="border: 0" allowfullscreen="" loading="lazy"></iframe>'

const Map = () => {
    return (
        <div dangerouslySetInnerHTML={{__html: iframe}} />
    );
};

export default Map;