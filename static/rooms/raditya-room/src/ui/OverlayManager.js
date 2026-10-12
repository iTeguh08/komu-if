/**
 * Overlay Manager for Raditya's Room
 * Handles Photo modal, TV game launch dialog, Room Info modal,
 * and the Spotify-style Bedroom Radio & Music Player modal.
 */
export class OverlayManager {
  constructor(roomConfig) {
    this.config = roomConfig;
    this.activeModal = null;
    this.musicManager = null;
    this.hasLoadedInitialSongs = false;

    this.cacheElements();
    this.initListeners();
    this.initRadioModalListeners();
  }

  cacheElements() {
    // Backdrop & Modals
    this.backdrop = document.getElementById('modal-backdrop');
    this.photoModal = document.getElementById('photo-modal');
    this.gameModal = document.getElementById('game-modal');
    this.infoModal = document.getElementById('info-modal');
    this.radioModal = document.getElementById('radio-modal');

    // Photo elements
    this.photoImg = document.getElementById('modal-photo-img');
    this.photoTitle = document.getElementById('modal-photo-title');
    this.photoCaption = document.getElementById('modal-photo-caption');
    this.photoMeta = document.getElementById('modal-photo-meta');

    // TV Game elements
    this.gameTitle = document.getElementById('modal-game-title');
    this.gameDescription = document.getElementById('modal-game-desc');
    this.gameUrlDisplay = document.getElementById('modal-game-url');
    this.gameLaunchBtn = document.getElementById('modal-game-launch-btn');

    // Bottom interactive cue
    this.interactionCue = document.getElementById('interaction-cue');
    this.cueText = document.getElementById('cue-text');
    this.cueSubtext = document.getElementById('cue-subtext');

    // Radio Modal elements
    this.radioTabs = document.querySelectorAll('.radio-tab');
    this.radioTabPanels = document.querySelectorAll('.radio-tab-panel');
    this.searchInput = document.getElementById('music-search-input');
    this.btnRunSearch = document.getElementById('btn-run-search');
    this.searchChips = document.querySelectorAll('.search-chip');
    this.searchStatus = document.getElementById('music-search-status');
    this.searchResults = document.getElementById('music-search-results');
    this.spotifyInput = document.getElementById('spotify-url-input');
    this.btnLoadSpotify = document.getElementById('btn-load-spotify');
    this.spotifyContainer = document.getElementById('spotify-embed-container');
    this.musicFileInput = document.getElementById('music-file-input');
    this.stationCards = document.querySelectorAll('.station-card');

    // Now Playing Bar
    this.nowPlayingArt = document.getElementById('now-playing-art');
    this.nowPlayingTitle = document.getElementById('now-playing-title');
    this.nowPlayingArtist = document.getElementById('now-playing-artist');
    this.modalBtnPlayPause = document.getElementById('modal-btn-play-pause');
    this.modalVolumeSlider = document.getElementById('modal-volume-slider');
  }

  initListeners() {
    // Escape key closes any active modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModal) {
        this.closeModal();
      }
    });

    // Backdrop click closes modal
    if (this.backdrop) {
      this.backdrop.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.closeModal();
        }
      });
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close-btn, .close-modal-trigger');
    closeButtons.forEach((btn) => {
      btn.addEventListener('click', () => this.closeModal());
    });

    // TV Launch button action
    if (this.gameLaunchBtn) {
      this.gameLaunchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.launchValidatedGameUrl();
      });
    }
  }

  setMusicManager(musicManager) {
    this.musicManager = musicManager;
    if (this.musicManager) {
      this.musicManager.onStateChange((state) => {
        this.updateRadioPlayerUI(state);
      });
    }
  }

  initRadioModalListeners() {
    // 1. Tab Switching
    this.radioTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        this.radioTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        this.radioTabPanels.forEach(panel => {
          if (panel.id === `tab-content-${targetTab}`) {
            panel.style.display = 'flex';
          } else {
            panel.style.display = 'none';
          }
        });
      });
    });

    // 2. Search Input & Button
    if (this.btnRunSearch && this.searchInput) {
      this.btnRunSearch.addEventListener('click', () => {
        this.executeSearch(this.searchInput.value);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.executeSearch(this.searchInput.value);
        }
      });
    }

    // 3. Search Chips
    this.searchChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.dataset.query;
        if (this.searchInput) {
          this.searchInput.value = query;
        }
        this.executeSearch(query);
      });
    });

    // 4. Spotify Embed Button
    if (this.btnLoadSpotify && this.spotifyInput) {
      this.btnLoadSpotify.addEventListener('click', () => {
        this.loadSpotifyEmbed(this.spotifyInput.value);
      });
    }

    // 5. Local MP3 File Upload
    if (this.musicFileInput) {
      this.musicFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file && this.musicManager) {
          this.musicManager.playLocalAudio(file);
        }
      });
    }

    // 6. Ambient Lo-Fi Preset Cards
    this.stationCards.forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.dataset.station, 10);
        if (this.musicManager) {
          this.musicManager.playSynthStation(index);
        }
      });
    });

    // 7. Modal Play/Pause
    if (this.modalBtnPlayPause) {
      this.modalBtnPlayPause.addEventListener('click', () => {
        if (this.musicManager) {
          this.musicManager.togglePlay();
        }
      });
    }

    // 8. Modal Volume Slider
    if (this.modalVolumeSlider) {
      this.modalVolumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        if (this.musicManager) {
          this.musicManager.setVolume(val);
        }
      });
    }
  }

  async executeSearch(query) {
    if (!this.musicManager || !query || !query.trim()) return;
    if (this.searchStatus) {
      this.searchStatus.textContent = `Mencari lagu "${query}" di database musik...`;
      this.searchStatus.style.display = 'block';
    }
    if (this.searchResults) {
      this.searchResults.innerHTML = '';
    }

    try {
      const results = await this.musicManager.searchSongs(query);
      if (!results || results.length === 0) {
        if (this.searchStatus) {
          this.searchStatus.textContent = `Tidak ditemukan lagu untuk "${query}". Coba kata kunci lain.`;
        }
        return;
      }

      if (this.searchStatus) {
        this.searchStatus.textContent = `Menemukan ${results.length} lagu:`;
      }
      this.renderSearchResults(results);
    } catch (err) {
      if (this.searchStatus) {
        this.searchStatus.textContent = 'Gagal memuat hasil. Silakan periksa koneksi internet.';
      }
    }
  }

  renderSearchResults(tracks) {
    if (!this.searchResults) return;
    this.searchResults.innerHTML = '';

    tracks.forEach(track => {
      const item = document.createElement('div');
      item.className = 'song-result-item';

      const artImg = track.artworkUrl
        ? `<img src="${track.artworkUrl}" class="song-artwork" alt="${track.title}">`
        : `<div class="song-artwork" style="display:flex;align-items:center;justify-content:center;background:#2A2B32;">🎵</div>`;

      item.innerHTML = `
        ${artImg}
        <div class="song-meta">
          <span class="song-title">${track.title}</span>
          <span class="song-artist">${track.artist}${track.album ? ' • ' + track.album : ''}</span>
        </div>
        <button class="song-play-action" type="button" aria-label="Putar lagu ${track.title}">▶</button>
      `;

      item.addEventListener('click', () => {
        if (this.musicManager) {
          this.musicManager.playTrack(track);
          // Highlight active item
          this.searchResults.querySelectorAll('.song-result-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
        }
      });

      this.searchResults.appendChild(item);
    });
  }

  loadSpotifyEmbed(url) {
    if (!this.musicManager || !this.spotifyContainer) return;
    const embedUrl = this.musicManager.parseSpotifyUrl(url);

    if (!embedUrl) {
      alert("Format link Spotify tidak valid. Gunakan format seperti: https://open.spotify.com/track/... atau playlist/...");
      return;
    }

    this.spotifyContainer.innerHTML = `
      <iframe class="spotify-iframe" 
        src="${embedUrl}" 
        width="100%" 
        height="180" 
        frameBorder="0" 
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy">
      </iframe>
    `;

    this.musicManager.setSpotifyEmbed(embedUrl, "Spotify Web Stream");
  }

  updateRadioPlayerUI(state) {
    const { isPlaying, currentTrack } = state;

    if (this.modalBtnPlayPause) {
      this.modalBtnPlayPause.textContent = isPlaying ? '⏸' : '▶';
    }

    if (currentTrack) {
      if (this.nowPlayingTitle) this.nowPlayingTitle.textContent = currentTrack.title || 'Lagu Berputar';
      if (this.nowPlayingArtist) this.nowPlayingArtist.textContent = currentTrack.artist || 'Artis';

      if (this.nowPlayingArt) {
        if (currentTrack.artworkUrl) {
          this.nowPlayingArt.innerHTML = `<img src="${currentTrack.artworkUrl}" alt="${currentTrack.title}">`;
        } else {
          this.nowPlayingArt.innerHTML = currentTrack.source === 'synth' ? '☕' : '📻';
        }
      }
    } else {
      if (this.nowPlayingTitle) this.nowPlayingTitle.textContent = isPlaying ? 'Radio Menyala' : 'Radio Dimatikan';
      if (this.nowPlayingArtist) this.nowPlayingArtist.textContent = isPlaying ? 'Lo-Fi Kamar' : 'Pilih lagu untuk memutar';
      if (this.nowPlayingArt) this.nowPlayingArt.innerHTML = '📻';
    }
  }

  openRadioModal() {
    if (!this.radioModal) return;
    this.showModal(this.radioModal);

    // Initial load recommendations once
    if (!this.hasLoadedInitialSongs) {
      this.hasLoadedInitialSongs = true;
      this.executeSearch('Vestia Zeta');
    }
  }

  openPhotoModal(photo, previewUrl) {
    if (!this.photoModal) return;

    this.photoImg.src = previewUrl || photo.imageUrl || '';
    this.photoImg.alt = photo.title || 'Wall photograph';
    this.photoTitle.textContent = photo.title;
    this.photoCaption.textContent = photo.caption;

    if (photo.isPlaceholder) {
      this.photoMeta.textContent = `[Gallery Item • Replaceable via src/config/roomConfig.js]`;
      this.photoMeta.style.display = 'inline-flex';
    } else {
      this.photoMeta.style.display = 'none';
    }

    this.showModal(this.photoModal);
  }

  openTVGameModal() {
    if (!this.gameModal) return;

    const gameUrl = this.config.gameUrl || '';
    this.gameTitle.textContent = this.config.gameName || "Raditya's Arcade";
    this.gameDescription.textContent = this.config.gameDescription || "Launch interactive web game on the bedroom TV.";
    this.gameUrlDisplay.textContent = gameUrl;

    this.showModal(this.gameModal);
  }

  launchValidatedGameUrl() {
    const rawUrl = this.config.gameUrl;
    if (!rawUrl) {
      alert("No game URL configured in roomConfig.js.");
      return;
    }

    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        window.open(parsed.href, '_blank', 'noopener,noreferrer');
        this.closeModal();
      } else {
        alert("Configured game URL is invalid. Only HTTP and HTTPS are permitted.");
      }
    } catch {
      alert("Invalid URL format configured in roomConfig.gameUrl.");
    }
  }

  openInfoModal() {
    if (!this.infoModal) return;
    this.showModal(this.infoModal);
  }

  showModal(modalElement) {
    // Hide all modal cards first
    [this.photoModal, this.gameModal, this.infoModal, this.radioModal].forEach((m) => {
      if (m) m.style.display = 'none';
    });

    modalElement.style.display = 'block';
    this.backdrop.classList.add('open');
    this.activeModal = modalElement;

    // Focus close button for keyboard accessibility
    const closeBtn = modalElement.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.focus();
  }

  closeModal() {
    if (this.backdrop) {
      this.backdrop.classList.remove('open');
    }
    this.activeModal = null;
  }

  showInteractionCue(cueData) {
    if (!this.interactionCue) return;
    if (cueData && cueData.name) {
      this.cueText.textContent = cueData.name;
      this.cueSubtext.textContent = cueData.hint ? ` • ${cueData.hint}` : '';
      this.interactionCue.classList.add('visible');
    } else {
      this.hideInteractionCue();
    }
  }

  hideInteractionCue() {
    if (this.interactionCue) {
      this.interactionCue.classList.remove('visible');
    }
  }
}
