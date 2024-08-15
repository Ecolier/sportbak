
FROM python:3.9-buster

ENV GSTREAMER_VERSION=1.18.0
ENV LIBDRM_VERSION=2.4.107

RUN sed -i -e's/ main/ main contrib non-free/g' /etc/apt/sources.list

RUN apt-get update && apt-get install -y \
    autoconf `# libnice` \
    automake `# libnice` \
    bison \
    build-essential \
    ca-certificates \
    flex \
    gettext \
    git \
    gnutls-dev `# libnice` \
    gtk-doc-tools `# libnice` \
    libffi-dev \
    libglib2.0 \
    liborc-0.4-dev \
    libopus-dev \
    libpcre3-dev \
    libsrtp2-dev \
    libssl-dev `# needed for DTLS requirement`\
    libtool `# libnice` \
    libvpx-dev \
    libx264-dev \
    mount \
    perl \
    wget \
    libavcodec-dev \
    libavfilter-dev \
    zlib1g \
    zlib1g-dev \
    libgdbm-dev \
    libnss3-dev \
    libsqlite3-dev \
    libreadline-dev \
    libffi-dev \
    curl \ 
    libbz2-dev \
    ninja-build \
    gobject-introspection \
    libgirepository1.0-dev \
    cmake \
    libpango1.0-dev \
    i965-va-driver \
    libcairo-dev \
    libva-dev \
    libdrm-dev \
    libdrm2 \
    libva-drm2 \
    libegl-mesa0 \
    libegl1-mesa-dev \
    libegl1 \
    libgbm1 \
    libgbm-dev \
    libxrandr2 \
    libxcb-xfixes0 \
    libxcb-xfixes0-dev \
    libgudev-1.0-0 \
    libgraphene-1.0-0 \
    libvisual-0.4-0 \
    libxrender-dev \
    x11-xserver-utils \
    libudev-dev \
    xorg-dev  \
    libglew2.1 \
    libglu1-mesa \
    mesa-utils \
    libpciaccess-dev \
    libgtk-3-dev \
    libgl-dev \
    yasm \
    libglvnd-dev \
    libgl1-mesa-dev \
    libegl1-mesa-dev \
    libgles2-mesa-dev \
    wayland-protocols

RUN apt-get update && apt-get install -y --no-install-recommends i965-va-driver-shaders

RUN pip3 install PyGObject \
    && pip3 install meson \
    && pip3 install wheel

RUN git clone https://gitlab.gnome.org/GNOME/pygobject.git \
    && cd pygobject \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
    && rm -Rf pygobject

RUN wget https://gstreamer.freedesktop.org/src/gstreamer/gstreamer-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gstreamer-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gstreamer-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd /

RUN wget https://gstreamer.freedesktop.org/src/gst-plugins-base/gst-plugins-base-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-base-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-base-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd /

RUN git clone https://github.com/libnice/libnice.git \
    && cd libnice \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \ 
    && rm -Rf libnice 

RUN wget https://gstreamer.freedesktop.org/src/gst-plugins-good/gst-plugins-good-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-good-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-good-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / 

RUN wget https://gstreamer.freedesktop.org/src/gst-plugins-bad/gst-plugins-bad-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-bad-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-bad-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / 

RUN wget https://gstreamer.freedesktop.org/src/gst-plugins-ugly/gst-plugins-ugly-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-ugly-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-ugly-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / 

RUN wget https://gstreamer.freedesktop.org/src/gst-libav/gst-libav-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-libav-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-libav-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd /

RUN wget https://gstreamer.freedesktop.org/src/gst-rtsp-server/gst-rtsp-server-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-rtsp-server-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-rtsp-server-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build  \
    && ninja -C build install \
    && cd /

RUN wget https://gstreamer.freedesktop.org/src/gst-python/gst-python-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-python-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-python-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
    && rm -rf gst* 

RUN wget https://dri.freedesktop.org/libdrm/libdrm-${LIBDRM_VERSION}.tar.xz \
    && tar xvfJ libdrm-${LIBDRM_VERSION}.tar.xz > /dev/null \
    && cd libdrm-${LIBDRM_VERSION} \
    && meson build \
    && ninja -C build\
    && ninja -C build install \
    && cd / \
    && rm -rf libdrm*   

RUN wget https://gstreamer.freedesktop.org/src/gstreamer-vaapi/gstreamer-vaapi-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gstreamer-vaapi-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gstreamer-vaapi-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build\
    && ninja -C build install \
    && cd / \
    && rm -rf gst*      

WORKDIR /code


COPY requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt

COPY big_noodle_titling.ttf /usr/local/share/fonts
RUN fc-cache -f -v

COPY . /code


VOLUME [ "/media" ]
ENTRYPOINT [ "/code/entrypoint.sh" ]

EXPOSE 9000

