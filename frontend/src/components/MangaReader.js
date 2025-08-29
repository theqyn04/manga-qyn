//components/MangaReader.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    NavigateBefore,
    NavigateNext,
    ZoomIn,
    ZoomOut,
    Fullscreen
} from '@mui/icons-material';

const MangaReader = ({ pages, mangaId, chapterNumber }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        // Lấy trạng thái đọc từ localStorage
        const savedPage = localStorage.getItem(`manga-${mangaId}-chapter-${chapterNumber}`);
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
    }, [comicId, chapterNumber]);

    const handleNextPage = () => {
        if (currentPage < pages.length - 1) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            localStorage.setItem(`manga-${mangaId}-chapter-${chapterNumber}`, newPage.toString());
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            localStorage.setItem(`manga-${mangaId}-chapter-${chapterNumber}`, newPage.toString());
        }
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleImageLoad = () => {
        setLoading(false);
        setImageError(false);
    };

    const handleImageError = () => {
        setLoading(false);
        setImageError(true);
    };

    if (pages.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <p>Chưa có trang nào trong chương này.</p>
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            {/* Controls */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                    display: 'flex',
                    gap: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 1,
                    p: 1
                }}
            >
                <IconButton onClick={handleZoomOut} color="inherit" size="small">
                    <ZoomOut />
                </IconButton>
                <IconButton onClick={handleZoomIn} color="inherit" size="small">
                    <ZoomIn />
                </IconButton>
            </Box>

            {/* Navigation */}
            {!isMobile && (
                <>
                    <IconButton
                        onClick={handlePrevPage}
                        disabled={currentPage === 0}
                        sx={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={handleNextPage}
                        disabled={currentPage === pages.length - 1}
                        sx={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                        }}
                    >
                        <NavigateNext />
                    </IconButton>
                </>
            )}

            {/* Page indicator */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 1
                }}
            >
                Trang {currentPage + 1} / {pages.length}
            </Box>

            {/* Image container */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                    overflow: 'auto',
                    bgcolor: 'background.default'
                }}
            >
                {loading && (
                    <CircularProgress sx={{ position: 'absolute' }} />
                )}

                {imageError ? (
                    <Box textAlign="center" p={3}>
                        <p>Không thể tải trang. Vui lòng thử lại sau.</p>
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={pages[currentPage]?.imageUrl}
                        alt={`Page ${currentPage + 1}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        sx={{
                            maxWidth: '100%',
                            height: 'auto',
                            transform: `scale(${zoom})`,
                            transition: 'transform 0.2s ease',
                            cursor: zoom > 1 ? 'grab' : 'pointer',
                            '&:active': {
                                cursor: zoom > 1 ? 'grabbing' : 'pointer'
                            }
                        }}
                        onClick={isMobile ? handleNextPage : undefined}
                    />
                )}
            </Box>

            {/* Mobile navigation */}
            {isMobile && (
                <Box display="flex" justifyContent="space-between" p={1}>
                    <IconButton onClick={handlePrevPage} disabled={currentPage === 0}>
                        <NavigateBefore />
                    </IconButton>
                    <IconButton onClick={handleNextPage} disabled={currentPage === pages.length - 1}>
                        <NavigateNext />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default ComicReader;