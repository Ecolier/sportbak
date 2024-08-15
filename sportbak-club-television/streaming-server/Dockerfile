
FROM python:3.9-buster

ENV GSTREAMER_VERSION=1.18.4

RUN apt-get update && apt-get install -y --no-install-recommends \
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
    cmake


RUN pip3 install PyGObject \
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
    && cd / \
# gst-plugins-base
    && wget https://gstreamer.freedesktop.org/src/gst-plugins-base/gst-plugins-base-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-base-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-base-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
# libnice
    && git clone https://github.com/libnice/libnice.git \
    && cd libnice \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \ 
    && rm -Rf libnice \
# gst-plugins-good
    && wget https://gstreamer.freedesktop.org/src/gst-plugins-good/gst-plugins-good-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-good-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-good-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
# gst-plugins-bad
    && wget https://gstreamer.freedesktop.org/src/gst-plugins-bad/gst-plugins-bad-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-bad-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-bad-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
# gst-plugins-ugly
    && wget https://gstreamer.freedesktop.org/src/gst-plugins-ugly/gst-plugins-ugly-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-plugins-ugly-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-plugins-ugly-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
# gst-rtsp-server
    && wget https://gstreamer.freedesktop.org/src/gst-rtsp-server/gst-rtsp-server-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-rtsp-server-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-rtsp-server-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build  \
    && ninja -C build install \
    && cd / \
    && wget https://gstreamer.freedesktop.org/src/gst-python/gst-python-${GSTREAMER_VERSION}.tar.xz \
    && tar xvfJ gst-python-${GSTREAMER_VERSION}.tar.xz > /dev/null \
    && cd gst-python-${GSTREAMER_VERSION} \
    && meson build --prefix=/usr/ \
    && ninja -C build \
    && ninja -C build install \
    && cd / \
    && rm -rf gst*    

WORKDIR /code
COPY requirements.txt ./

RUN pip3 install --no-cache-dir -r requirements.txt

COPY . /code

ENTRYPOINT [ "/code/entrypoint.sh" ]
RUN ["chmod", "+x", "/code/entrypoint.sh"]

EXPOSE 8080 1935
