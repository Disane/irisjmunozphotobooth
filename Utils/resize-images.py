import os
from PIL import Image
from argparse import ArgumentParser

__author = 'disane'

'''
    author: elias "disane" t.
    requirements: 
        pillow, argparser, pyinstaller

    Create Windows Standalone Executable:
        pyinstaller -F resize-images.py
'''

def absolute_file_paths_to_files(directory):
    for dirpath, _, filenames in os.walk(directory):
        for f in filenames:
            # ignore sub directories
            if not os.path.isdir(f): 
                yield os.path.abspath(os.path.join(dirpath,f))

if __name__ == "__main__":
    argparser = ArgumentParser(description="Resizes .jpg .png .jpeg images, default target width=1280px")
    argparser.add_argument('-d', '--directory', help="Directory to process", required=True)
    argparser.add_argument('-w', '--width', help="Request image width to resize the target images to.", required=False)
    argparser.add_argument('-o', '--overwrite', help="Request to overwrite already existing image files instead of making copies of resized images.", action="store_true")
    args = argparser.parse_args()

    MAXWIDTH = 1280

    image_paths = []
    if args.directory:
        if args.width:
            MAXWIDTH = int(args.width)
        # size = (height, width)
        for path in absolute_file_paths_to_files(args.directory):
            if os.path.isfile(path):
                try:
                    im = Image.open(path)
                    print('Converting ' + str(path) + ' format: ' + str(im.format) + ' size: ' + str(im.size) + ' mode: ' + im.mode)
                    size_ratio = MAXWIDTH / im.size[0]
                    new_size = (int(im.size[0]*size_ratio), int(im.size[1]*size_ratio))
                    if args.overwrite:
                        new_path = path
                    else:
                        # extract absolute path and filename without the file extention and change 
                        # the exteansion to .smaller
                        new_path = os.path.splitext(path)[0] + '.smaller' + '.jpeg'
                    im.resize(new_size).save(new_path, "JPEG")
                except IOError:
                    print('Could not resize image file!')
