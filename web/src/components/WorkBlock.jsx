import React from 'react';

const WorkBlock = () => {
    return (
        <section id="work-block" className="block block--light-gray">
            <header className="block__header aos-overflow-hidden">
                <h2 className="block__heading" data-aos="fade-up">Nuestros trabajos</h2>
            </header>
            <div className="carrousel container">
                {/* carrousel slides */}
                <div className="carrousel__slides">
                    <div id="item-1" className="carrousel__slides-item">
                        <img src="/images/works/work-01.jpg" alt="" />
                    </div>
                    <div id="item-2" className="carrousel__slides-item">
                        <img src="/images/works/work-02.jpg" alt="" />
                    </div>
                    <div id="item-3" className="carrousel__slides-item">
                        <img src="/images/works/work-03.jpg" id="item-3" alt="" />
                    </div>
                    <div id="item-4" className="carrousel__slides-item">
                        <img src="/images/works/work-04.jpg" id="item-4" alt="" />
                    </div>
                    <div id="item-5" className="carrousel__slides-item">
                        <img src="/images/works/work-05.jpg" id="item-5"  alt="" />
                    </div>
                    <div id="item-6" className="carrousel__slides-item">
                        <img src="/images/works/work-06.jpg" id="item-5"  alt="" />
                    </div>
                    <div id="item-7" className="carrousel__slides-item">
                        <img src="/images/works/work-07.jpg" id="item-7"  alt="" />
                    </div>
                    <div id="item-8" className="carrousel__slides-item">
                        <img src="/images/works/work-08.jpg" id="item-8"  alt="" />
                    </div>
                    <div id="item-9" className="carrousel__slides-item">
                        <img src="/images/works/work-09.jpg" id="item-9"  alt="" />
                    </div>
                    <div id="item-10" className="carrousel__slides-item">
                        <img src="/images/works/work-10.jpg" id="item-10" alt="" />
                    </div>
                </div>
            
                {/* carrousel navgator */}
                <div className="carrousel__navigator">
                    <a href="#thumbnail-8" className="slider__chevron">
                        <img src="/images/left-arrow.png" alt="" />
                    </a>
                    
                    <div className="slider__thumbnails">
                        <a href="#item-1">
                            <div id="item-1">
                                <img src="/images/works/work-01.jpg" alt="" />
                            </div>
                        </a>
                        <a href="#item-2">
                            <div id="item-2">
                                <img src="/images/works/work-02.jpg" alt="" />
                            </div>
                        </a>
                        <a href="#item-3">
                            <div id="item-3">
                                <img src="/images/works/work-03.jpg" id="item-3" alt="" />
                            </div>
                        </a>
                        <a href="#item-4">
                            <div id="item-4">
                                <img src="/images/works/work-04.jpg" id="item-4" alt="" />
                            </div>
                        </a>
                    
                        <a href="#item-5">
                            <div id="item-5">
                                <img src="/images/works/work-05.jpg" id="item-5"  alt="" />
                            </div>
                        </a>
                        <a href="#item-6">
                            <div id="item-6">
                                <img src="/images/works/work-06.jpg"  id="item-6"  alt="" />
                            </div>
                        </a>
                        <a href="#item-7">
                            <div id="item-7">
                                <img src="/images/works/work-07.jpg" id="item-7"  alt="" />
                            </div>
                        </a>
                        <a href="#item-8">
                            <div id="thumbnail-8">
                                <img src="/images/works/work-08.jpg" id="item-8"  alt="" />
                            </div>
                        </a>
                        <a href="#item-9">
                            <div id="item-9">
                                <img src="/images/works/work-09.jpg" id="item-9"  alt="" />
                            </div>
                        </a>
                        <a href="#item-10">
                            <div id="item-10">
                                <img src="/images/works/work-10.jpg" id="item-10" alt="" />
                            </div>
                        </a>                                
                 </div>
    
                 <a href="#item-test" className="slider__chevron">
                    <img src="/images/right-arrow.png" alt="" />
                </a>
                </div>
            </div>
        </section>
    );
};

export default WorkBlock;