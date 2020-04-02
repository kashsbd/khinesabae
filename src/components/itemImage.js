import React, { Component } from 'react';

export class ItemImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnVisible: false
        }
    }
    onFocusImage = () => {
        this.setState({ btnVisible: true });
    }

    onBlurImage = () => {
        this.setState({ btnVisible: false });
    }

    onImageRemove(path) {
        const { onRemoveImg } = this.props;
        onRemoveImg && onRemoveImg(path);
    }

    render() {
        const { path, imgIndex } = this.props;

        console.log(path)
        
        let imgPath ;

        if(path.type === 'online') {
            imgPath = path.path;
        }else {
            imgPath = URL.createObjectURL(path.path);
        }

        return (
            <div
                onMouseEnter={this.onFocusImage}
                onMouseLeave={this.onBlurImage}
            >
                <img
                    src={imgPath}
                    className="img-thumbnail img-responsive"
                    style={{ height: '100', marginTop: 5, marginBottom: 5 }}
                />
                {
                    this.state.btnVisible ?
                        <div style={{ margin: 10, position: 'relative', zIndex: 2, bottom: 60 }}>
                            <button
                                type="button"
                                className="btn btn-danger btn-flat btn-block"
                                onClick={() => this.onImageRemove(path)}>Remove</button>
                        </div>
                        :
                        null
                }
            </div>
        )
    }
}