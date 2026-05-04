// ═══════════════════════════════════════════════════════════
//   Our Social Media Videos - Carousel & Video Playback
//   Based on Watch & Buy Section from mobile-cases project
// ═══════════════════════════════════════════════════════════

$(document).ready(function() {

    // ── Social Media Videos carousel — Center with loop ──
    var $socialMediaVideos = $('#social-media-videos-carousel').owlCarousel({
        loop: true,
        center: true,
        autoplay: true,
        autoplayTimeout: 4000,
        autoplayHoverPause: true,
        dots: true,
        nav: false,
        smartSpeed: 650,
        margin: 24,
        responsive: {
            0:    { items: 1,   stagePadding: 60 },
            480:  { items: 1,   stagePadding: 100 },
            768:  { items: 2,   stagePadding: 80 },
            1024: { items: 3,   stagePadding: 100 },
            1280: { items: 3,   stagePadding: 140 }
        }
    });

    // Function to handle video playback
    function handleVideoPlayback() {
        // Play all videos for demo purposes
        $('.smv-card__video').each(function() {
            var video = this;
            // Check if video has source
            var hasSource = video.src || (video.querySelector('source') && video.querySelector('source').src);

            if (hasSource) {
                // Load the video if not loaded
                if (video.readyState === 0) {
                    video.load();
                }

                $(this).addClass('playing');
                video.play().catch(function(error) {
                    // Video autoplay prevented
                });
            }
        });
    }

    // Handle video playback when carousel changes
    function handleCarouselChange() {
        handleVideoPlayback();
    }

    // Initial video setup
    setTimeout(handleCarouselChange, 100);

    // Listen to both 'changed' and 'translated' events for better reliability
    $socialMediaVideos.on('changed.owl.carousel translated.owl.carousel', function (e) {
        var count = e.item.count;
        if (!count) return;
        var owl = $socialMediaVideos.data('owl.carousel');
        var current = owl.relative(e.item.index);
        var progress = ((current + 1) / count) * 100;
        $('#smv-progress').css('width', progress + '%');

        // Handle video playback with slight delay to ensure DOM is ready
        setTimeout(handleCarouselChange, 50);
    });

    $('#smv-prev').on('click', function () {
        $socialMediaVideos.trigger('prev.owl.carousel', [400]);
    });
    $('#smv-next').on('click', function () {
        $socialMediaVideos.trigger('next.owl.carousel', [400]);
    });

    // Click on play button - let it bubble to card to open modal
    // Removed click handler for .smv-reel-play so clicks can reach .smv-card

    // ── Social Media Videos — open Bootstrap modal on card click ──
    var smvModalElement = document.getElementById('smvModal');
    if (!smvModalElement) {
        return;
    }
    var smvModal = new bootstrap.Modal(smvModalElement);

    $(document).on('click', '.smv-card', function (e) {
        e.preventDefault();
        var $card = $(this);
        var img       = $card.data('img');
        var video     = $card.data('video');
        var title     = $card.data('title');
        var subtitle  = $card.data('subtitle');
        var views     = $card.data('views');
        var likes     = $card.data('likes');
        var badge     = $card.data('badge');
        var badgeType = $card.data('badge-type');
        var desc      = $card.data('desc');
        var link      = $card.data('link');

        // Handle video or image
        var $modalVideo = $('#smv-modal-video');
        var $modalImg = $('#smv-modal-img');

        if (video) {
            // Show video, hide image
            $('#smv-modal-video-source').attr('src', video);
            $modalVideo[0].load();
            $modalVideo.removeClass('d-none').addClass('smv-modal-video-active');
            $modalImg.addClass('d-none');
        } else {
            // Show image, hide video
            $modalImg.attr('src', img).attr('alt', title).removeClass('d-none');
            $modalVideo.addClass('d-none').removeClass('smv-modal-video-active');
            $modalVideo[0].pause();
        }

        $('#smv-modal-title').text(title);
        $('#smv-modal-subtitle').text(subtitle);
        $('#smv-modal-views').text(views);
        $('#smv-modal-likes').text(likes);
        $('#smv-modal-desc').text(desc);

        // Update watch button link
        if (link) {
            $('#smv-modal-watch-btn').attr('href', link);
        }

        // Handle badge
        var $modalBadge = $('#smv-modal-badge');
        if (badge) {
            $modalBadge.text(badge)
                .removeClass('smv-badge--new smv-badge--hot smv-badge--trending')
                .addClass('smv-badge--' + badgeType)
                .show();
        } else {
            $modalBadge.hide();
        }

        smvModal.show();
    });

    // Also handle clicks on the media area (backup handler)
    $(document).on('click', '.smv-card__media', function (e) {
        e.preventDefault();
        $(this).closest('.smv-card').trigger('click');
    });

    // Pause video when modal closes
    $('#smvModal').on('hidden.bs.modal', function () {
        var $modalVideo = $('#smv-modal-video');
        if ($modalVideo.length) {
            $modalVideo[0].pause();
            $modalVideo[0].currentTime = 0;
        }
    });

    // Play video when modal opens
    $('#smvModal').on('shown.bs.modal', function () {
        var $modalVideo = $('#smv-modal-video');
        if ($modalVideo.hasClass('smv-modal-video-active')) {
            $modalVideo[0].play().catch(function(error) {
                // Modal video autoplay prevented
            });
        }
    });

});
