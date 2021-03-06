import { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { toCanvas } from 'html-to-image';
import ImagePreview from '../ImagePreview/ImagePreview';
import ImageUploader from './../ImageUploader/ImageUploader';
import BlendColorEditor from '../BlendColorEditor/BlendColorEditor';
import TextEditor from './../TextEditor/TextEditor';
import Modal from '../UI/Modal/Modal';
import Card from '../UI/CustomCard/CustomCard';
import RederedImage from '../RederedImage/RederedImage';
import CustomButton from '../UI/CustomButton/CustomButton';
import useRenderImage from '../Hooks/useRenderImage';
import { defaultValues } from '../Utils/Constants/defaultValues';
import { createImageQueryString } from '../Utils/createImageQueryString';

export default function Compositor() {
    const [imageUrl, setImageUrl] = useState('')
    const [blendColor, setBlendColor] = useState(defaultValues.blendColor);
    const [imageText, setImageText] = useState('');
    const [rgba, setRgba] = useState(defaultValues.overlayColor);
    const [verticalTextPositon, setVerticalTextPostion] = useState(defaultValues.verticalTextPosition);
    const [horizontalTextPosition, setHorizontalTextPosition] = useState(defaultValues.horizontalTextPosition);
    const [textColor, setTextColor] = useState(defaultValues.textColor);
    const [fontSize, setFontSize] = useState(defaultValues.fontSize);
    const [modalOpen, setModalOpen] = useState(false)
    const [viewerSize, setViewerSize] = useState(defaultValues.defaultPreviewSize);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const [renderImage, loading, downloadUrl] = useRenderImage(imageRef, canvasRef);
    function onRenderImage() {
        setModalOpen(true)
        renderImage()
    }
    function handlePreviewSizeChange(e) {
        const { value } = e.target;
        setViewerSize(value)
    }
    return (
        <CompositerContainer>
            <h1>Image Compositor</h1>
            {modalOpen && <Modal
                setModalOpen={setModalOpen}
                viewerSize={viewerSize}
            >
                <RederedImage 
                    canvasRef={canvasRef} 
                    loading={loading} 
                    imageDownloadLink={downloadUrl} 
                    downloadName={createImageQueryString("TestImage.JPEG", imageText, blendColor)} 
                />
            </Modal>
        }
                <ImagePreview
                    imageUrl={imageUrl}
                    rgba={rgba}
                    imageText={imageText}
                    fontSize={fontSize}
                    textColor={textColor}
                    verticalTextPositon={verticalTextPositon}
                    horizontalTextPosition={horizontalTextPosition}
                    imageRef={imageRef}
                    viewerSize={viewerSize}
                />
            <div>
                <ViewSizeButtons>
                    {
                        defaultValues.viwerSizes.map(viewer => {
                            return <CustomButton onClickFunc={handlePreviewSizeChange} btnTxt={viewer.label} value={viewer.size} disabled={viewer.size === viewerSize} key={viewer.label} />
                        })
                    }
                </ViewSizeButtons>
            </div>
            <RenderButtonContainer>
                <CustomButton btnTxt={imageUrl ? "Render Image" : "Please add an Image to Render"} onClickFunc={onRenderImage} disabled={!imageUrl} />
            </RenderButtonContainer>
            <EditorsContainer>
                <Card cardWidth="400px" >
                    <ImageUploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
                </Card>
                <Card cardWidth="400px">
                    <BlendColorEditor
                        setBlendColor={setBlendColor}
                        blendColor={blendColor}
                        setRgba={setRgba}
                        rgba={rgba}
                    />
                </Card>
                <Card cardWidth="400px">
                    <TextEditor
                        imageText={imageText}
                        setImageText={setImageText}
                        horizontalTextPosition={horizontalTextPosition}
                        setHorizontalTextPosition={setHorizontalTextPosition}
                        verticalTextPositon={verticalTextPositon}
                        setVerticalTextPostion={setVerticalTextPostion}
                        textColor={textColor}
                        setTextColor={setTextColor}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                    />
                </Card>
            </EditorsContainer>
        </CompositerContainer>
    )
}

const CompositerContainer = styled.div`
    text-align: center
`

const EditorsContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-item: center;
    justify-content: space-evenly;
    flex-wrap: wrap 
`;

const RenderButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 10px
    `;
const ViewSizeButtons = styled.ul`
    display: flex;
    justify-content: center;
    margin-right: 20px
    `
