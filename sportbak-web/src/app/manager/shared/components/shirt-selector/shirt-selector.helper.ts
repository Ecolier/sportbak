const sortShirts = (allShirts: string[]) => {
  const defaultShirts = [];
  const customShirts = [];
  for (const shirt of allShirts) {
    if (shirt.match('default/')) {
      defaultShirts.push(shirt);
    } else {
      customShirts.push(shirt);
    }
  }
  return {defaultShirts, customShirts};
};

const isFileAnImage = (file: File) => {
  return file.type.match('image/jpeg') || file.type.match('image/png');
};

const createCanvas = (side: number): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.height = side;
  canvas.width = side;
  return canvas;
};

const defineNewImgSize = (img: HTMLImageElement, side: number) => {
  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > side) {
      height *= side / width;
      width = side;
    }
  } else {
    if (height > side) {
      width *= side / height;
      height = side;
    }
  }
  return {width, height};
};

const resizeImage = (img: HTMLImageElement, side: number) => {
  const canvas = createCanvas(side);
  const {width, height} = defineNewImgSize(img, side);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, side / 2 - width / 2, side / 2 - height / 2, width, height);
  return canvas.toDataURL('image/png');
};

const createImage = (image: string) => {
  return new Promise<string>((resolve) => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve(resizeImage(img, 50));
    };
    img.src = image;
  });
};

export {sortShirts, isFileAnImage, resizeImage, createImage};
