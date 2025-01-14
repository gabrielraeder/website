---
hide:
  - toc
---

# Tutorial

## Setup

For the tutorial, we will be using a local MedPerf server and a local mocked auth provider. The MedPerf client installed in your virtual machines is preconfigured to communicate with the local server.

Now to run the local server,

Run:

```bash
conda activate medperf
cd ~/medperf/server
sh setup-dev-server.sh
```

## MedPerf Client Installation and Authentication

All involved parties that intend to use the MedPerf client will have to signup for a MedPerf account, install the client, and login prior to using it.

For our tutorial, we already setup the virtual machines with MedPerf preinstalled. We will use the `Local` profile config.

```bash
conda activate medperf
medperf --version
```

Check profiles by running `medperf profile view`. You will see `server: https://localhost:8000` and the auth configuration used is `Local`.

## Training Setup with MedPerf (Model Owner)

```bash
medperf auth login -e modelowner@example.com
```

### Define the data preparation MLCube

- Prepare the data preparation pipeline logic that will transform the raw clinical data into AI-ready data. This will be an MLCube

### Register the MLCube

```bash
medperf mlcube submit -n prep \
    -m https://storage.googleapis.com/medperf-storage/testfl/mlcube_prep.yaml
```

### Define the training MLCube

- Prepare the training logic using OpenFL and GaNDLF

### Register the Training MLCube

```bash
medperf mlcube submit -n traincube \
    -m https://storage.googleapis.com/medperf-storage/testfl/mlcube-cpu.yaml?v=2 \
    -p https://storage.googleapis.com/medperf-storage/testfl/parameters-miccai.yaml \
    -a https://storage.googleapis.com/medperf-storage/testfl/init_weights_miccai.tar.gz
```

### Register the Training Experiment

```bash
medperf training submit -n trainexp -d trainexp -p 1 -m 2
```

The server admin should approve the experiment.
Run:

```bash
bash admin_training_approval.sh
```

## Aggregator Setup with MedPerf (Aggregator Owner)

```bash
medperf auth login -e aggowner@example.com
```

### register aggregator

```bash
medperf aggregator submit -n aggreg -a $(hostname --fqdn) -p 50273
```

### Associate the aggregator with the experiment

```bash
medperf aggregator associate -a 1 -t 1
```

## Data preparation (Training Data Owner)

```bash
medperf auth login -e traincol1@example.com
```

### Process your data using the data prep mlcube

```bash
medperf dataset create -p 1 -d datasets/col1 -l datasets/col1 --name col1 --description col1data --location col1location
```

### Register your dataset

find Hash:

```bash
medperf dataset ls
```

```bash
medperf dataset submit -d <hash_found>
```

### Request participation in the training experiment

```bash
medperf training associate_dataset -t 1 -d 1
```

## Redo the same with collaborator 2

```bash
bash shortcut.sh
```

## Accepting Training Participation (Model Owner)

```bash
medperf auth login -e modelowner@example.com
```

### Accept participation requests

```bash
medperf training approve_association -t 1 -a 1
medperf training approve_association -t 1 -d 1
medperf training approve_association -t 1 -d 2
```

### Lock the experiment

```bash
medperf training lock -t 1
```

## Run the Aggregator (Aggregator Owner)

```bash
medperf auth login -e aggowner@example.com
```

```bash
medperf aggregator start -a 1 -t 1
```

(Now move to another terminal)

## Run Training (Training Data Owner)

First collaborator:

```bash
medperf auth login -e traincol1@example.com
```

```bash
medperf training run -d 1 -t 1
```

(Now move to another terminal)

Second collaborator:

```bash
medperf auth login -e traincol2@example.com
```

```bash
medperf training run -d 2 -t 1
```

## Inference Setup with MedPerf (Benchmark Owner)

```bash
medperf auth login -e benchmarkowner@example.com
```

### Register a reference model

```bash
medperf mlcube submit -n refmodel \
    -m https://storage.googleapis.com/medperf-storage/testfl/mlcube_other.yaml
```

### Register the metrics MLCube

- Prepare the metrics calculation logic that will be used for the evaluation and the benchmarking of multiple trained models on unseen data.

```bash
medperf mlcube submit -n metrics \
    -m https://storage.googleapis.com/medperf-storage/testfl/mlcube_metrics.yaml \
    -p https://storage.googleapis.com/medperf-storage/testfl/parameters_metrics.yaml
```

### Register the benchmark

```bash
medperf benchmark submit --name pathmnistbmk --description pathmnistbmk \
    --demo-url https://storage.googleapis.com/medperf-storage/testfl/data/sample.tar.gz \
    -p 1 -m 3 -e 4
```

The server admin should approve the benchmark.
Run:

```bash
bash admin_benchmark_approval.sh
```

## Participate as a model owner (Model Owner)

```bash
medperf auth login -e modelowner@example.com
```

### Register your model

- Export the trained model to an MLCube using GaNDLF

```bash
medperf mlcube submit -n trained \
    -m https://storage.googleapis.com/medperf-storage/testfl/mlcube_trained.yaml
```

### Request participation in the benchmark

```bash
medperf mlcube associate -b 1 -m 5 -y
```

## Participate as a data owner (Inference data Owner)

```bash
medperf auth login -e testcol@example.com
```

### Process data using the data prep mlcube

```bash
medperf dataset create -p 1 -d datasets/test -l datasets/test --name testdata --description testdata --location testdata
```

### Register the dataset

find Hash:

```bash
medperf dataset ls
```

```bash
medperf dataset submit -d <hash_found>
```

### Request participation

```bash
medperf dataset associate -b 1 -d 3 -y
```

## Accepting Inference Participation (Benchmark Owner)

```bash
medperf auth login -e benchmarkowner@example.com
```

Accept inference participation requests (from the model owners and data owners)

```bash
medperf association approve -b 1 -m 5
medperf association approve -b 1 -d 3
```

## Run Inference (Inference Data Owner)

```bash
medperf auth login -e testcol@example.com
```

### Start benchmark execution

- models associated with the benchmark, including the reference model, will be executed on the data

```bash
medperf benchmark run -b 1 -d 3
```

### Submit inference results

```bash
medperf result submit -r b1m5d3 -y
medperf result submit -r b1m3d3 -y
```

## Result collection (Benchmark Owner)

```bash
medperf auth login -e benchmarkowner@example.com
```

Pull and view inference results from the medperf server

```bash
medperf result view -b 1
```
