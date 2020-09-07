try:
    import pickle
    import face_recognition
    import os
    import shutil
    import numpy as np
    import time
    import math
    import sys

    start = time.time()

    DESIGNATED_NAME = sys.argv[1]
    companyid = sys.argv[2]

    kf = open(f'./pickles/{companyid}/known_faces','rb')
    kn = open(f'./pickles/{companyid}/known_names','rb')
    known_faces = pickle.load(kf)
    known_names = pickle.load(kn)
    kf.close()
    kn.close()

    # for i in os.listdir(KNOWN_FACES_DIR):
    #     if i == DESIGNATED_NAME:
    #         shutil.rmtree(f'{KNOWN_FACES_DIR}/{i}', ignore_errors=True)

    for i in range(len(known_names)- 1, -1, -1):
            if known_names[i] == DESIGNATED_NAME:
                del known_names[i]
                known_faces.pop(i)
    if len(known_faces) == 0 and len(known_names) == 0:
        os.remove(f'./pickles/{companyid}/known_faces')
        os.remove(f'./pickles/{companyid}/known_names')
    else:         
        f = open(f'./pickles/{companyid}/known_faces','wb')
        n = open(f'./pickles/{companyid}/known_names','wb')
        newFaces = pickle.dump(known_faces,f, pickle.HIGHEST_PROTOCOL)
        newNames = pickle.dump(known_names,n, pickle.HIGHEST_PROTOCOL)
        f.close()    
        n.close()

    end = time.time()

    print('Tardó: ' + str(int(end-start))+ ' segundos. Eliminado perro')


except Exception as ex:
    print('Err: '+ex)